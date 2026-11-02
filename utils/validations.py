import re
import filetype
from datetime import datetime


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "mp4", "webm"}
ALLOWED_MIMETYPES = {
    "image/jpeg", "image/png", "image/gif",
    "video/mp4", "video/webm"
}
VALID_TYPES = {"rapaz", "acuatica", "no-voladora", "urbana", "otra"}


def validate_required(value):
    return value is not None and str(value).strip() != ""


def validate_name(value):
    return value is not None and len(str(value).strip()) >= 3


def validate_email(email):
    if email is None:
        return False
    email = email.strip()
    return (
        len(email) >= 8
        and re.match(r"^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$", email) is not None
    )


def validate_phone(phone):
    return phone is not None and len(phone) >= 9 and phone.isdigit()


def validate_postal(postal):
    # El codigo postal es opcional
    if postal is None:
        return True
    postal = postal.strip()
    return len(postal) >= 4 and postal.isdigit()


def validate_past_date(value):
    try:
        return datetime.fromisoformat(value) <= datetime.now()
    except (ValueError, TypeError):
        return False


def validate_sighting_file(file):
    if file is None or file.filename == "":
        return False
    header = file.stream.read(261)
    file.stream.seek(0)

    ftype_guess = filetype.guess(header)
    if ftype_guess is None:
        return False

    return (
        ftype_guess.extension in ALLOWED_EXTENSIONS
        and ftype_guess.mime in ALLOWED_MIMETYPES
    )


def validate_sighting_files(files):
    if not files or len(files) < 1 or len(files) > 3:
        return False

    for f in files:
        if not validate_sighting_file(f):
            return False

    return True


def validate_register_volunteer(name, lastName, email, cellphone, region, commune, postalNumber):
    return (
        validate_name(name)
        and validate_name(lastName)
        and validate_email(email)
        and validate_phone(cellphone)
        and validate_required(region)
        and validate_required(commune)
        and validate_postal(postalNumber)
    )


def validate_register_sighting(type, name, date, commune, region, files):
    return (
        type in VALID_TYPES
        and validate_required(name)
        and validate_past_date(date)
        and validate_required(commune)
        and validate_required(region)
        and validate_sighting_files(files)
    )