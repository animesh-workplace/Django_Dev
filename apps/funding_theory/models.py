from django.db import models

# Create your models here.
class BillingItem(models.Model):
	item_name 	= models.CharField(max_length=120, null=True, blank=True)
	number_1 	= models.IntegerField()
	number_2 	= models.IntegerField()
	number_3 	= models.IntegerField()
	total 		= models.IntegerField()
	timestamp   = models.DateTimeField(auto_now_add=True)

	def __unicode__(self):
		return "{total}".format(total=self.total)

	def __str__(self):
		return "{total}".format(total=self.total)