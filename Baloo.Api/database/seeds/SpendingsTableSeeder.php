<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Spending;

class SpendingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      if (!Spending::where('name', '=', "Printer")->exists()) {
        $spending = new Spending();
        $spending->name = 'Printer';
        $spending->payment = 200;
        $spending->date = Carbon::today()->addWeeks(2);
        $spending->save();
      }
      if (!Spending::where('name', '=', "Tables")->exists()) {
        $spending = new Spending();
        $spending->name = 'Tables';
        $spending->payment = 100;
        $spending->date = Carbon::today()->addWeeks(1);
        $spending->save();
      }
      if (!Spending::where('name', '=', "Electricty Invoice")->exists()) {
        $spending = new Spending();
        $spending->name = 'Electricty Invoice';
        $spending->payment = 70;
        $spending->date = Carbon::today();
        $spending->save();
      }
      if (!Spending::where('name', '=', "Lamps")->exists()) {
        $spending = new Spending();
        $spending->name = 'Lamps';
        $spending->payment = 10;
        $spending->date = Carbon::today();
        $spending->save();
      }
    }
}
