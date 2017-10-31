<?php

namespace App\Http\Transformers\client;

use League\Fractal\TransformerAbstract;
use App\Client as Model;
use Storage;


class ClientViewModel extends TransformerAbstract
{

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

}
