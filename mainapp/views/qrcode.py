from django.views.generic import TemplateView

class QrCode(TemplateView):
    template_name = "qrcode.html"

