<?php

namespace App\Http\Transformers\Spending;

use League\Fractal\TransformerAbstract;
use App\Spending as Model;


class SpendingViewModel extends TransformerAbstract
{

    public function transform(Model $model)
    {
        return [
            'id' => $model->id,
            'name' => $model->name,
            'date' => $model->date,
            'payment' => $model->payment
        ];
    }
}
