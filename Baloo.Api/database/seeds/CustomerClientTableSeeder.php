<?php

use Illuminate\Database\Seeder;
use App\Client;

class CustomerClientTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!Client::where('licenseId', '=', "6724452")->exists()) {

          $client = new Client();
          $client->name = "jawad shoman";
          $client->father = "ali";
          $client->mother = "zena";
          $client->birthPlace = "beirut";
          $client->nationality = "lebaniese";
          $client->dob = "1972-01-09";
          $client->licenseIssueDate = "1992-01-09";
          $client->licenseExpiryDate = "2030-01-09";
          $client->licenseType = "public";
          $client->sejel = "332";
          $client->licenseId = "6724452";
          $client->address = "Lebanon - Beirut - Dawra Street Hamdan - Building S14";
          $client->save();
        }

        if (!Client::where('licenseId', '=', "9844452")->exists()) {

          $client = new Client();
          $client->name = "ali mohamad";
          $client->father = "rida";
          $client->mother = "zainab";
          $client->birthPlace = "beirut";
          $client->nationality = "lebaniese";
          $client->dob = "1990-02-01";
          $client->licenseIssueDate = "1992-01-09";
          $client->licenseExpiryDate = "2030-01-09";
          $client->licenseType = "private";
          $client->sejel = "332";
          $client->licenseId = "9844452";
          $client->contactNumber = "03695847";
          $client->emergencyContact = "03568923";
          $client->address = "Lebanon - Beirut - Hamra Street H2O - Building S24";
          $client->save();
        }

        if (!Client::where('licenseId', '=', "9884451")->exists()) {

          $client = new Client();
          $client->name = "hasan hamoud";
          $client->father = "ali";
          $client->mother = "diana";
          $client->birthPlace = "beirut";
          $client->nationality = "lebaniese";
          $client->dob = "1990-02-01";
          $client->licenseIssueDate = "1992-01-09";
          $client->licenseExpiryDate = "2030-01-09";
          $client->licenseType = "private";
          $client->sejel = "332";
          $client->licenseId = "9844452";
          $client->contactNumber = "03622247";
          $client->emergencyContact = "03567723";
          $client->address = "Lebanon - Beirut - Hamra Street H2O - Building S24";
          $client->save();
        }

        if (!Client::where('licenseId', '=', "9884251")->exists()) {

          $client = new Client();
          $client->name = "sali hareb";
          $client->father = "hamza";
          $client->mother = "sawsan";
          $client->birthPlace = "beirut";
          $client->nationality = "lebaniese";
          $client->dob = "1992-02-01";
          $client->licenseIssueDate = "1992-01-09";
          $client->licenseExpiryDate = "2030-01-09";
          $client->licenseType = "private";
          $client->sejel = "132";
          $client->licenseId = "9844452";
          $client->contactNumber = "03677847";
          $client->emergencyContact = "03564423";
          $client->address = "Lebanon - Beirut - Hamra Street H2O - Building S24";
          $client->save();
        }
    }
}
