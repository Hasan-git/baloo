<?php

use Illuminate\Database\Seeder;
use App\Repair;

class RepairTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!Repair::where('problem', '=', "BMX Engin Fails")->exists()) {
          $repair1 = new Repair();
          $repair1->date = "2017-01-02";
          $repair1->completionDate = "2017-02-02";
          $repair1->problem = "BMX Engin Fails";
          $repair1->garage = "Salah";
          $repair1->cost = 200;
          $repair1->clientTotalCost = 150;
          $repair1->clientPayment = 100;
          $repair1->clientDueAmount = 50;
          $repair1->cost = 200;
          $repair1->company = "Ins";
          $repair1->car_id = 1;
          $repair1->client_id = 1;
          $repair1->isFinished = 0;
          $repair1->save();
        }

        if (!Repair::where('problem', '=', "Seats")->exists()) {
          $repair2 = new Repair();
          $repair2->date = "2017-04-02";
          $repair2->completionDate = "2017-04-09";
          $repair2->problem = "Seats";
          $repair2->garage = "Salah";
          $repair2->cost = 200;
          $repair2->clientTotalCost = 150;
          $repair2->clientPayment = 100;
          $repair2->clientDueAmount = 50;
          $repair2->company = "Ins";
          $repair2->car_id = 1;
          $repair2->client_id = 1;
          $repair2->isFinished = 1;
          $repair2->save();
        }

        if (!Repair::where('problem', '=', "Left Tire")->exists()) {
          $repair3 = new Repair();
          $repair3->date = "2017-05-02";
          $repair3->completionDate = "2017-05-02";
          $repair3->problem = "Left Tire";
          $repair3->garage = "Extra Tires";
          $repair3->cost = 300;
          $repair3->clientTotalCost = 250;
          $repair3->clientPayment = 200;
          $repair3->clientDueAmount = 50;
          $repair3->company = "Ins";
          $repair3->car_id = 1;
          $repair3->client_id = 1;
          $repair3->isFinished = 1;
          $repair3->save();
        }

        if (!Repair::where('problem', '=', "AC")->exists()) {
          $repair4 = new Repair();
          $repair4->date = "2017-01-02";
          $repair4->completionDate = "2017-01-03";
          $repair4->problem = "AC";
          $repair4->garage = "EMA";
          $repair4->cost = 500;
          $repair4->clientTotalCost = 350;
          $repair4->clientPayment = 200;
          $repair4->clientDueAmount = 150;
          $repair4->company = "Ins";
          $repair4->car_id = 1;
          $repair4->client_id = 2;
          $repair4->isFinished = 0;
          $repair4->save();
        }
    }
}
