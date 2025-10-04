from django.contrib import admin
from .models import Company, Flight
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id','code','name','is_active')
    search_fields = ('code','name')

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('id','company','flight_no','origin','destination','departure_at','arrival_at','seats_available','status')
    list_filter = ('company','status','origin','destination')
    search_fields = ('flight_no',)
