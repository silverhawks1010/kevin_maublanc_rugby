from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core import serializers
import json

from .models import Event, Stadium, Team, Ticket

def api():
    data = serializers.serialize("json", Ticket.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_get(request, pk):
    if pk == "events":
        data = serializers.serialize("json", Event.objects.all())
    elif pk == "stadiums":
        data = serializers.serialize("json", Stadium.objects.all())
    elif pk == "teams":
        data = serializers.serialize("json", Team.objects.all())       
    else:
        return JsonResponse("[]", safe=False)
    return JsonResponse(json.loads(data), safe=False)        
    

def api_ticket(request, pk):
    data = serializers.serialize("json", Ticket.objects.filter(pk=pk))
    return JsonResponse(json.loads(data), safe=False)