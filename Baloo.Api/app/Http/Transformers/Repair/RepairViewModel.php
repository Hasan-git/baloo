<?php

namespace App\Http\Transformers\Repair;

use App\Http\Transformers\Client\ClientViewModel;
use App\Http\Transformers\Car\CarViewModel;
use League\Fractal\TransformerAbstract;
use App\Repair as Model;
use App\Car;
use Storage;

class RepairViewModel extends TransformerAbstract
{

    protected $availableIncludes = [
        'car','client'
    ];
    // protected $defaultIncludes = [
    //     'car','client'
    // ];

    public function transform(Model $model)
    {
        if(Storage::has('repairs/'.$model->image) && !!$model->image )
            $imageUrl = Storage::url('repairs/'.$model->image);
        else
            $imageUrl = "";

        return [
            'id' => $model->id,
            'date' => $model->date,
            'completionDate' => $model->completionDate,
            'problem' => $model->problem,
            'garage' => $model->garage,
            'cost' => $model->cost,
            'car_id' => $model->car_id,
            'client_id' => $model->client_id,
            'company' => $model->company,
            'isFinished' => $model->isFinished,
            'image' => $model->image,
            'imageUrl' => $imageUrl,
            'clientTotalCost' => $model->clientTotalCost,
            'clientPayment' => $model->clientPayment,
            'clientDueAmount' => $model->clientDueAmount,
            // 'created_at' => $model->created_at->toIso8601String(),
            // 'updated_at' => $model->updated_at->toIso8601String()
        ];
    }

    public function includeCar(Model $model)
    {
        if(!!$model->car)
            return $this->item($model->car, new CarViewModel);
    }

    public function includeClient(Model $model)
    {
        if(!!$model->client)
            return $this->item($model->client, new ClientViewModel);
    }
}
