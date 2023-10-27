from django.urls import path
# Import des URLs de l'interface d'administration
from django.contrib import admin
# Import des vues qui sont déclarées dans leur propre module (dossier)
from .views import HomeView, StadiumsView, TeamsView, NewsletterView, UpdateView, AboutView, MobileView, QrCode
from .api import api, api_ticket, api_teams, api_stadiums, api_events

urlpatterns = (
    path("", HomeView.as_view(), name="home"),
    path("stadiums/", StadiumsView.as_view(), name="stadiums"),
    path("teams/", TeamsView.as_view(), name="teams"),
    path("newsletter/", NewsletterView.as_view(), name="newsletter"),
    path("update/", UpdateView.as_view(), name="update"),
    path("about/", AboutView.as_view(), name="about"),
    path("mobile/", MobileView.as_view(), name="mobile"),
    path("scan/", QrCode.as_view(), name="qrcode"),

    path("api/", api, name="api"),
    path("api/events/", api_events, name="api_get"),
    path("api/stadiums/", api_stadiums, name="api_get"),
    path("api/teams/", api_teams, name="api_get"),
    
    path("api/ticket/<str:pk>/", api_ticket, name="api_ticket"),


    path("vfjifjsoldijfdsjfdjsdfdsjvhsjvisjhusdvhdsi", admin.site.urls),
)
