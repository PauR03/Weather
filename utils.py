import ephem #Saber fase lunar
from datetime import datetime, timedelta

def obtener_porcentaje_iluminacion():
    fecha_actual = datetime.now().strftime("%Y/%m/%d")
    observer = ephem.Observer()
    observer.date = fecha_actual

    moon = ephem.Moon()
    moon.compute(observer)  

    return int(moon.moon_phase * 100)

def obtener_fase_lunar(fecha_actual, funcion_ephem, es_siguiente=True):
    fecha_actual_obj = datetime.strptime(fecha_actual, "%Y/%m/%d")

    if es_siguiente:
        proxima_fase = funcion_ephem(fecha_actual)
    else:
        fecha_anterior_obj = fecha_actual_obj - timedelta(days=1)
        fecha_anterior = fecha_anterior_obj.strftime("%Y/%m/%d")
        anterior_fase = funcion_ephem(fecha_anterior)
        fecha_anterior_fase = str(anterior_fase).split(" ")[0]
        fecha_anterior_fase_obj = datetime.strptime(fecha_anterior_fase, "%Y/%m/%d")

        if fecha_anterior_fase_obj == fecha_anterior_obj:
            return True
        return False

    fecha_proxima_fase = str(proxima_fase).split(" ")[0]
    fecha_proxima_fase_obj = datetime.strptime(fecha_proxima_fase, "%Y/%m/%d")

    if fecha_proxima_fase_obj == fecha_actual_obj:
        return True
    return False

def obtener_diccionario_fases_lunares(porcentaje_iluminado):
    MOONS = {
        "creciente": False,
        "decreciente": False,
        "llena": False,
        "nueva": False
    }

    fecha_actual = datetime.now().strftime("%Y/%m/%d")

    if 40 <= porcentaje_iluminado <= 49:
        MOONS["creciente"] = obtener_fase_lunar(fecha_actual, ephem.next_first_quarter_moon)
        MOONS["decreciente"] = obtener_fase_lunar(fecha_actual, ephem.next_last_quarter_moon, es_siguiente=False)
    elif porcentaje_iluminado >= 99:
        MOONS["llena"] = obtener_fase_lunar(fecha_actual, ephem.next_full_moon)
        porcentaje_iluminado = 100 if MOONS["llena"] else porcentaje_iluminado
    elif porcentaje_iluminado <= 1:
        MOONS["nueva"] = obtener_fase_lunar(fecha_actual, ephem.next_new_moon)
        porcentaje_iluminado = 1 if not MOONS["nueva"] and porcentaje_iluminado == 0 else porcentaje_iluminado

    return MOONS