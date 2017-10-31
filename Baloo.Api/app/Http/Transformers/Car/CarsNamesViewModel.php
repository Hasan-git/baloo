<?php

namespace App\Http\Transformers\car;

use League\Fractal\TransformerAbstract;
use App\CarsNames as Model ;


class CarsNamesViewModel extends TransformerAbstract
{

    public function transform(Model $model)
    {
        return [
            'id' => $model->id,
            'name' => $model->name

        ];
    }
}
