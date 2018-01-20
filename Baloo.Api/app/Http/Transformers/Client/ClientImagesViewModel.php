<?php

namespace App\Http\Transformers\client;

use League\Fractal\TransformerAbstract;
use App\Clients_images as Model;
use Storage;


class ClientImagesViewModel extends TransformerAbstract
{

    public function transform(Model $model)
    {
         if(Storage::has('clients/'.$model->name) && !!$model->name )
            $imageUrl = Storage::url('clients/'.$model->name);
        else
            $imageUrl = "";

        return [
            'id' => $model->id,
            'name' => $model->name,
            'clientId' => $model->client_id,
            'imageUrl' => $imageUrl,
        ];
    }

}
