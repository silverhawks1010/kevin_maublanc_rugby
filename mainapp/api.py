from django.http import JsonResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import json, qrcode, uuid, os, random
from PIL import Image, ImageFont, ImageDraw

from .models import Event, Stadium, Team, Ticket

def api():
    data = serializers.serialize("json", Ticket.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_events(request):
    data = list(Event.objects.values())
    stadium = list(Stadium.objects.values())
    team = list(Team.objects.values())

    for v in data:
        v["stadium_id"] = stadium[v["stadium_id"]-1]
        if v["team_home_id"]:
            v["team_home_id"] = team[v["team_home_id"]-1]
        if v["team_away_id"]:
            v["team_away_id"] = team[v["team_away_id"]-1]
    
    return JsonResponse(data, safe=False)

def api_stadiums(request):
    data = serializers.serialize("json", Stadium.objects.all())
    return JsonResponse(json.loads(data), safe=False, encoder=DjangoJSONEncoder)

def api_teams(request):
    data = serializers.serialize("json", Team.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_ticket(request, pk):
    data = serializers.serialize("json", Ticket.objects.filter(pk=pk))
    return JsonResponse(json.loads(data), safe=False)

def qrcodegenerate(request, pk):
    tid, eid, ttype = uuid.uuid4(), int(pk[0]), pk[1:]
    event,stadium,team = list(Event.objects.values())[eid-1], list(Stadium.objects.values()), list(Team.objects.values())
    font_opensans_42pt = ImageFont.truetype(os.path.dirname(__file__) + "/static/Akshar-Bold.ttf", 42)
    font_opensans2_38pt = ImageFont.truetype(os.path.dirname(__file__) + "/static/Akshar-Medium.ttf", 38)

    with Image.open(os.path.dirname(__file__) + "/static/billet.png") as im:
        draw = ImageDraw.Draw(im)
        date = event["start"]

        if date.minute == 0:
            minutes = "00"
        else:
            minutes = date.minute

        seat = ''.join([ttype[0], "-",  str(random.randint(10, 99))])
        if ttype == "Silver":
            seat = "Libre"
        price = 10
        if ttype == "Gold":
            price = 50
        elif ttype == "Platinium":
            price = 100


        draw.text((877, 115), team[event["team_home_id"]-1]["country"], font=font_opensans_42pt, fill=(0,0,0))
        draw.text((877, 242), team[event["team_away_id"]-1]["country"], font=font_opensans_42pt, fill=(0,0,0))
        draw.text((705, 375), stadium[event["stadium_id"]-1]["name"], font=font_opensans2_38pt, fill=(255,255,255))
        draw.text((1155, 375), stadium[event["stadium_id"]-1]["location"], font=font_opensans2_38pt, fill=(255,255,255))
        draw.text((705, 485), f"{date.day}/{date.month}/{date.year}", font=font_opensans2_38pt, fill=(255,255,255))
        draw.text((1155, 485), f"{date.hour}:{minutes}", font=font_opensans2_38pt, fill=(255,255,255))
        draw.text((650, 605), ttype, font=font_opensans2_38pt, fill=(255,255,255))
        draw.text((845, 605), seat, font=font_opensans2_38pt, fill=(255,255,255))
        draw.text((995, 605), str(price) + "€", font=font_opensans2_38pt, fill=(255,255,255))

        qr = qrcode.QRCode(box_size=4)
        qr.add_data(tid)
        qr.make()

        qr_im = qr.make_image()

        im.paste(qr_im, (111, 340))

        im.save(os.path.dirname(__file__) + "/static/qrcode/" + str(tid) + ".png")

    if seat == "Libre":
        seat = "free"
    Ticket.objects.create(id=tid, event_id=eid, category=ttype, seat=seat, price=price, currency="EUR")
    return JsonResponse({'qrurl': f'http://127.0.0.1:8000/static/qrcode/{tid}.png'})

