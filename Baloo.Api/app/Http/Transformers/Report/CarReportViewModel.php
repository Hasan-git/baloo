<?php

namespace App\Http\Transformers\Report;

use League\Fractal\TransformerAbstract;
use App\Car as Model;

// For sold cars
class CarReportViewModel extends TransformerAbstract
{

    public function transform(Model $model)
    {
        $model->inActiveRents;
        $model->repairs;
        $model->brand = $model->name->brand;
        $model->name = $model->name->name;
        $model->isSold = false;

        $model->rentsCount = $model->inActiveRents->count();
        $model->rentsDays = $model->inActiveRents->sum('days');
        $model->carKm = $model->inActiveRents->max('kmOut');

        $model->repairsCount = $model->repairs->count();

        $model->rentsRevenue = 0;
        $model->repairsCost = 0;

        //repairs cost
        foreach ($model->repairs as $key => $repair) {
          $model->repairsCost += ($repair->cost -  $repair->clientTotalCost);
        }

        //rents  revenue
        foreach ($model->inActiveRents as $key => $rent) {
          $model->rentsRevenue += $rent->total;
        }

        if( !!$model->sellingPrice){
            $model->isSold = true;
            $model->revenueAfterSelling =
            (($model->rentsRevenue + $model->sellingPrice ) - ($model->repairsCost + $model->purchasingPrice)) ;
        }

        $model->totalRevenue = $model->rentsRevenue - $model->repairsCost ;

        return [
            'id' => $model->id,
            'name' => $model->name,
            'brand' => $model->brand,
            'plateNumber' => $model->plateNumber,
            'purchasingPrice' => $model->purchasingPrice,
            'purchasingDate' => $model->purchasingDate,
            'sellingPrice' => $model->sellingPrice,
            'sellingDate' => $model->sellingDate,
            'rentsCount' => $model->rentsCount,
            'rentsRevenue' => $model->rentsRevenue,
            'repairsCount' => $model->repairsCount,
            'repairsCost' => $model->repairsCost,
            'totalRevenue' => $model->totalRevenue,
            'revenueAfterSelling' => $model->revenueAfterSelling,
            'rentsDays' => $model->rentsDays,
            'carKm' => $model->carKm,
            'isSold' => $model->isSold,
        ];
    }
}
