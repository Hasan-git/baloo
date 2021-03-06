<?php

namespace App\Http\Transformers\Car;

use League\Fractal\TransformerAbstract;
use App\Car as Model;
use Storage;
use Carbon;

class CarViewModel extends TransformerAbstract
{

    //protected $availableIncludes = ['names','repairs'];

    public function transform(Model $model)
    {
        // avoid errors if name was deleted from Names Table
        $name = $model->name ? $model->name->brand. " " .$model->name->name : "Unnamed";

        if(Storage::has('cars/'.$model->image) && !!$model->image )
            $imageUrl = Storage::url('cars/'.$model->image);
        else
            $imageUrl = "";


        return [
            'id' => (int) $model->id,
            'name' => $name,
            'brand' => $model->name->brand,
            'km' => $model->km,
            'name_id' => (int) $model->name_id,
            'type' => $model->type,
            'status' => $model->status,
            'chassisNumber' => $model->chassisNumber,
            'plateNumber' => $model->plateNumber,
            'model' => $model->model,
            'color' => $model->color,
            'notes' => $model->notes,
            'image' => $model->image,
            'imageUrl' => $imageUrl,
            'status' => $model->status,
            'repairs' => $model->activeRepairs,
            'officialMechanic' => Carbon::parse($model->officialMechanic)->format('Y/m/d')  ,
            'purchasingDate' =>  Carbon::parse($model->purchasingDate)->format('Y/m/d') ,
            'purchasingPrice' => $model->purchasingPrice,
            'closestReserve' => $model->closestReserve,
            'reservations' => $model->reservations,
            'currentRent' => $model->currentRent
        ];

    }

    // public function includeNames(Model $model)
    // {
    //     return $this->item($model->name, new CarsNamesViewModel);
    // }

    // public function includeRepairs(Model $model)
    // {
    //     return $this->collection($model->repairs, new CarsNamesViewModel);
    // }
}
