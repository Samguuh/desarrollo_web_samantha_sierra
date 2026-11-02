from flask import Flask, request, render_template, redirect, url_for, session, flash, jsonify
from flask_cors import cross_origin
from utils.validations import validate_register_volunteer, validate_register_sighting
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)


app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# funcion auxiliar para el registro y extraccion de archivos file de los avistamientos
def process_and_save_file(file_storage):
    if not file_storage or file_storage.filename == "":
        return None

    _filename = hashlib.sha256(
        secure_filename(file_storage.filename).encode("utf-8")
    ).hexdigest()

    _extension = secure_filename(file_storage.filename).rsplit(".", 1)[-1].lower()
    img_filename = f"{_filename}.{_extension}"

    file_storage.save(os.path.join(app.config["UPLOAD_FOLDER"], img_filename))

    return img_filename

@app.route("/register", methods = ["POST", "GET"])

def register():
    regiones = db.get_region()
    comunas_data = db.get_comunas_grouped_by_region()
    if request.method == "POST":
        name = request.form.get("name")
        lastName = request.form.get("lastname")
        email = request.form.get("email")
        cellphone = request.form.get("cellphone")
        region = request.form.get("region")
        commune = request.form.get("commune")
        postalNumber = request.form.get("postalnumber") or None
        error = ""

        if validate_register_volunteer(name, lastName, email, cellphone, region, commune, postalNumber):
            status, msg = db.register_volunteer(name, lastName, email, cellphone, commune)
            if status:
                session["user_id"] = db.get_user_by_email(email)[0]
                flash("Voluntario registrado correctamente.")
                return redirect(url_for("register"))
            error += msg
        else:
            error += "Uno de los campos no es valido."

        return render_template("formulario/form.html", regiones=regiones, comunas_data=comunas_data, error=error)
    return render_template("formulario/form.html", regiones=regiones, comunas_data=comunas_data, error=None)

@app.route("/sighting", methods=["POST", "GET"])
def sighting():
    regiones = db.get_region()
    comunas_data = db.get_comunas_grouped_by_region()
    aves = db.get_birds()
    voluntarios = db.get_voluntarios()
    
    if request.method == "POST":
        ave_id = request.form.get("name")   
        name = request.form.get("name")
        date = request.form.get("date")         
        commune = request.form.get("commune")   
        region = request.form.get("region")     
        type_bird = request.form.get("type")    
        files = request.files.getlist("file")
        
        voluntario_id = request.form.get("voluntario", type=int)
        lugar = commune
        descripcion = type_bird

        if voluntario_id and validate_register_sighting(type_bird, ave_id, date, commune, region, files):
            file1 = process_and_save_file(files[0]) if len(files) > 0 else None
            file2 = process_and_save_file(files[1]) if len(files) > 1 else None
            file3 = process_and_save_file(files[2]) if len(files) > 2 else None
            ave_id = int(name)
            status, msg = db.create_sighting(voluntario_id, ave_id, date, lugar, descripcion)
            if status:
                for f, saved in zip(files, (file1, file2, file3)):
                    if saved:
                        db.create_registro(saved, f.filename, msg)
                flash("Avistamiento registrado correctamente.")
                return redirect(url_for("index"))
            error = msg
        else:
            error = "Uno de los campos no es válido."
        
        return render_template("avistamientos/sighting.html", regiones=regiones, comunas_data=comunas_data, aves=aves, voluntarios=voluntarios, error=error)
        
    return render_template("avistamientos/sighting.html", regiones=regiones, comunas_data=comunas_data, aves=aves, voluntarios=voluntarios, error=None)

@app.route("/")
def index():
    data = db.get_last_sightings()
    return render_template("index.html", data=data)

@app.route("/api/sightings")
def api_sightings():
    page = max(request.args.get("page", 1, type=int), 1)
    tipo = request.args.get("type", "")
    orden = request.args.get("order", "fecha")
    rows = db.get_sightings(tipo, orden, (page - 1) * 5)
    for r in rows:
        r["fecha"] = str(r["fecha"])
    return jsonify({"rows": rows[:5], "has_next": len(rows) > 5})

@app.route("/sighting/<int:sighting_id>", methods=["GET", "POST"])
def sighting_detail(sighting_id):
    sighting = db.get_sighting_by_id(sighting_id)
    if sighting is None:
        return redirect(url_for("sighting"))
    error = None
    if request.method == "POST":
        name = request.form.get("name")
        text = request.form.get("comment")
        if  3 <= len(name) <= 50 and 5 <= len(text) <= 300:
            db.create_comment(name, text, sighting_id)
            return redirect(url_for("sighting_detail", sighting_id=sighting_id))
        error = "El nombre debe tener entre 3 y 50 caracteres y el comentario entre 5 y 300."

    files = db.get_sighting_files(sighting_id)
    comments = db.get_comments(sighting_id)
    return render_template("avistamientos/detail.html", sighting=sighting, files=files, comments=comments, error=error)

# --- Stats ---

@app.route("/stats", methods=["GET"])
def stats():
    return render_template("/stats.html")

@app.route("/get-stats-data", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data():
    stats_data = db.get_db_stats()
    stats_data.sort(key=lambda x: x["date"])
    pie_data = db.get_db_sighting()
    barr_data = db.get_db_volunteers()
    return jsonify({
        "line_data": stats_data,
        "pie_data": pie_data,
        "barr_data": barr_data
    })
                           
if __name__ == "__main__":
    app.run(debug=True)
