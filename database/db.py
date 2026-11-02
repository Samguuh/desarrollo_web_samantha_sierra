import pymysql
import json

DB_NAME = "tarea2"
DB_USERNAME = "cc5002" 
DB_PASSWORD = "programacionweb" 
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8"

with open('database/querys.json', 'r') as querys:
	QUERY_DICT = json.load(querys)

# --conn--

def get_conn():
	conn = pymysql.connect(
		db=DB_NAME,
		user=DB_USERNAME,
		passwd=DB_PASSWORD,
		host=DB_HOST,
		port=DB_PORT,
		charset=DB_CHARSET
	)
	return conn

# -- querys --
    
    #inyeccion de datos de voluntariados en la data base 
	
def create_volunteer(name, lastName, email, cellphone, comunne):
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["create_volunteer"], (name + " " + lastName, email, cellphone, comunne))
	conn.commit()
	conn.close()
	
    # obtencion de datos relacionados a email, regiones y comunas

def get_user_by_email(email):
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["get_user_by_email"], (email,))
	user = cursor.fetchone()
	conn.close()
	return user

def get_region():
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["get_region"])
	regiones = cursor.fetchall()
	conn.close()
	return regiones

def get_comunas_grouped_by_region():
    conn = get_conn()
    cursor = conn.cursor(pymysql.cursors.DictCursor) # https://pymysql.readthedocs.io/en/latest/modules/cursors.html
    
    cursor.execute(QUERY_DICT["get_commune_grouped_by_region"])
    comunas = cursor.fetchall()
    cursor.close()
    
    data = {}
    for c in comunas:
        reg_id = str(c["region_id"])
        if reg_id not in data:
            data[reg_id] = []
        data[reg_id].append({"id": c["id"], "nombre": c["nombre"]})
        
    return data


    # obtencion de datos sobre las aves 

def get_birds():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_birds"])
    birds = cursor.fetchall()
    cursor.close()
    conn.close()
    return birds

def create_sighting(voluntario_id, ave_id, fecha_hora, lugar, descripcion):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["create_sighting"], (voluntario_id, ave_id, fecha_hora, lugar, descripcion))
    avistamiento_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return True, avistamiento_id

def get_last_sightings():
	conn = get_conn()
	cursor = conn.cursor(pymysql.cursors.DictCursor)
	cursor.execute(QUERY_DICT["get_last_sightings"])
	sightings = cursor.fetchall()
	conn.close()
	return sightings

def get_voluntarios():
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["get_voluntarios"])
	voluntarios = cursor.fetchall()
	conn.close()
	return voluntarios

def get_sightings(tipo, orden, offset):
	conn = get_conn()
	cursor = conn.cursor(pymysql.cursors.DictCursor)
	cursor.execute(QUERY_DICT["get_sightings"], (tipo, tipo, orden, offset))
	sightings = cursor.fetchall()
	conn.close()
	return sightings

def get_sighting_by_id(sighting_id):
	conn = get_conn()
	cursor = conn.cursor(pymysql.cursors.DictCursor)
	cursor.execute(QUERY_DICT["get_sighting_by_id"], (sighting_id,))
	sighting = cursor.fetchone()
	conn.close()
	return sighting

def get_sighting_files(sighting_id):
	conn = get_conn()
	cursor = conn.cursor(pymysql.cursors.DictCursor)
	cursor.execute(QUERY_DICT["get_sighting_files"], (sighting_id,))
	files = cursor.fetchall()
	conn.close()
	return files

# -- db-related functions --

def register_volunteer(name, lastName, email, cellphone, comunne):
	_email_user_ = get_user_by_email(email)
	if _email_user_ is not None:
		return False, "El correo ya esta en uso."
	create_volunteer(name, lastName, email, cellphone, comunne)
	return True, None


def create_registro(ruta_archivo, nombre_archivo, avistamiento_id):
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["create_registro"], (ruta_archivo, nombre_archivo, avistamiento_id))
	conn.commit()
	conn.close()

# -- db-stats --

def get_db_stats():
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["get_stats"])
	stats = cursor.fetchall()
	conn.close()
	stats_data = []
	for stat in stats:
		new_date = stat[0].strftime("%Y-%m-%d") if hasattr(stat[0], 'strftime') else str(stat[0])
		stats_data.append({
            "date": str(new_date),  
            "count": int(stat[1])  
        })
	return stats_data

def get_db_sighting():
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["get_number_sighting"])
	datas = cursor.fetchall()
	conn.close()
	sighting_data = []
	for data in datas:
		sighting_data.append({
			"label": str(data[0]),  
			"count": int(data[1])  
		})
	return sighting_data

def get_db_volunteers():
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["get_volunteers_comune"])
	datas = cursor.fetchall()
	conn.close()
	volunteer_data = []
	for data in datas:
		volunteer_data.append({
			"comune": str(data[0]),  
			"volunteers": int(data[1])  
		})
	return volunteer_data 

#comentario 

def create_comment(name, comment, sighting_id):
	conn = get_conn()
	cursor = conn.cursor()
	cursor.execute(QUERY_DICT["create_comment"], (name, comment, sighting_id))
	conn.commit()
	conn.close()

def get_comments(sighting_id):
    conn = get_conn()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute(QUERY_DICT["get_comment"], (sighting_id,))
    comments = cursor.fetchall()
    conn.close()
    return comments
	