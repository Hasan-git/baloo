<?php

namespace App\Http\Transformers\Report;

use League\Fractal\TransformerAbstract;
use App\Car as Model;

// For sold cars
class ActiveCarReportViewModel extends TransformerAbstract
{

    public function transform(Model $model)
    {
        $model->inActiveRents;
        $model->repairs;
        

        return [
            'id' => $model->id,
            'plateNumber' => $model->plateNumber,
        ];
    }
}
