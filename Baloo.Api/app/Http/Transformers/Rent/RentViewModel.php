<?php

namespace App\Http\Transformers\Rent;

use App\Http\Transformers\Client\ClientViewModel;
use App\Http\Transformers\Car\CarViewModel;
use League\Fractal\TransformerAbstract;
use App\Rent as Model;
use App\Client;
use App\Car;

class RentViewModel extends TransformerAbstract
{

     protected $availableIncludes = [
        'car','client'
    ];

     protected $defaultIncludes = [
        'car','client'
    ];

    public function transform(Model $model)
    {

        return [
            'id' => (int) $model->id,
            'dateOut' => (string)$model->dateOut,
            'dateIn' => (string)$model->dateIn,
            'days' => (int) $model->days,
            'costPerDay' => (int) $model->costPerDay,
            'total' => (int) $model->total,
            'cash' =>  (int) $model->cash,
            'dueAmount' => (int) $model->dueAmount,
            'deposit' => (int) $model->deposit,
            'notes' => $model->notes,
            'kmOut' => $model->kmOut,
            'kmIn' => $model->kmIn,
            'kmTotal' => $model->kmTotal,
            'employee' => $model->employee,
            'secondDriverName' => $model->secondDriverName,
            'secondDriverLicenseId' => $model->secondDriverLicenseId,
            'status' => $model->status,
            'car_id' => (int) $model->car_id,
            'client_id' => (int) $model->client_id,
            //'secondary_client_id' => (int) $model->secondary_client_id
        ];
    }

    public function includeCar(Model $model)
    {
        return $this->item($model->car, new CarViewModel);
    }

    public function includeClient(Model $model)
    {
        if(!!$model->client)
        return $this->item($model->client, new ClientViewModel);
    }

    // public function includeSecondaryClient(Model $model)
    // {
    //     if(!!$model->secondaryClient)
    //     return $this->item($model->secondaryClient, new ClientViewModel);
    // }
}
