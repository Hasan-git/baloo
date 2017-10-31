<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Collection;
use App\Car;
use Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Schema::defaultStringLength(191);

        Validator::extend('rentDates', function ($attribute, $value, $parameters, $validator) {
            $data = $validator->getData();

            if( isset($data['car_id']) && isset($data['dateOut']) && isset($data['dateIn']) ){
                $carReservations = Car::find($data['car_id'])->reservations;

                foreach ($carReservations as $k => $reservation){

                    //in case of update bypass validation on self record
                     if( isset ( $data['id'] ) && $reservation->id == $data['id'] )
                        return true;

                    $out = Carbon::parse($reservation->dateOut);
                    $in  = Carbon::parse($reservation->dateIn);
                    $condition = Carbon::parse($value)->between($out, $in,true) ;

                    if($condition)
                        return !$condition;
                }
                return true;

            }
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {

        // public function register()
        // {
        //     if ($this->app->environment() == 'local') {
        //         $this->app->register('Laracasts\Generators\GeneratorsServiceProvider');
        //     }
        // }
    }
}
