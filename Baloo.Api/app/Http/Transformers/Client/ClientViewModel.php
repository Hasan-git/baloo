<?php

namespace App\Http\Transformers\client;

use App\Http\Transformers\client\ClientImagesViewModel;
use League\Fractal\TransformerAbstract;
use App\Client as Model;
use App\ClientsImages;
use Storage;

class ClientViewModel extends TransformerAbstract
{

    protected $defaultIncludes = [
        'clientImages'
    ];

    public function transform(Model $model)
    {
         if(Storage::has('clients/'.$model->image) && !!$model->image )
            $imageUrl = Storage::url('clients/'.$model->image);
        else
            $imageUrl = "";

        return [
            'id' => $model->id,
            'name' => $model->name,
            'father' => $model->father,
            'mother' => $model->mother,
            'birthPlace' => $model->birthPlace,
            'dob' => $model->dob,
            'sejel' => $model->sejel,
            'licenseId' => $model->licenseId,
            'address' => $model->address,
            'contactNumber' => $model->contactNumber,
            'emergencyContact' => $model->emergencyContact,
            'totalDueAmount' => $model->totalDueAmount,
            'nationality' => $model->nationality,
            'licenseIssueDate' => $model->licenseIssueDate,
            'licenseExpiryDate' => $model->licenseExpiryDate,
            'licenseType' => $model->licenseType,
            'image' => $model->image,
            'imageUrl' => $imageUrl,
        ];
    }

    public function includeclientImages(Model $model)
    {   
        if(!!$model->images)
        return $this->collection($model->images, new ClientImagesViewModel);
    }

}
