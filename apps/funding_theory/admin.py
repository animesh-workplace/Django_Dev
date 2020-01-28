from django.contrib import admin

# Register your models here.
from .models import BillingItem

admin.site.register(BillingItem)