from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import json
import qrcode
import uuid
import os
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
    tid = uuid.uuid4()
    eid = pk

    font_opensans_42pt = ImageFont.truetype( f'mainapp/static/Akshar-Bold.ttf', 42)
    font_opensans2_38pt = ImageFont.truetype(f'mainapp/static/Akshar-Medium.ttf', 38)

    img = Image.open(f'mainapp/static/billet.png')
    
    

    qr = qrcode.make(pk)
    qr.save(f'mainapp/static/qrcode/{pk}_qrcode.png')
    return JsonResponse({'qrurl': f'http://127.0.0.1:8000/static/qrcode/{pk}_qrcode.png'})

