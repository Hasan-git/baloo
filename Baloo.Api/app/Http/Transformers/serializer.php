<?php
namespace App\Http\Transformers;

// Set as Default Serializer in config/fractal-laravel
// Collection & Item does not append data in case of include
class serializer extends \League\Fractal\Serializer\ArraySerializer
{
    // public function collection($resourceKey, array $data)
    // {
    //   //return [$resourceKey ?: 'data' => $data]; // Original serialize condition
    //     return $data;
    // }
    // public function item($resourceKey, array $data)
    // {
    //     return $data;
    // }
}
