# Generated by Django 4.0.5 on 2022-06-19 15:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0003_bids_listining'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bids',
            old_name='listining',
            new_name='listing',
        ),
    ]