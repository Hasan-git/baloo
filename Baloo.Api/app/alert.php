<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class alert extends Model
{


//   public function setIsCompletedAttribute($value)
// {
//     $this->attributes['isCompleted'] = (int) $value;
// }
  protected $fillable = ['title','content','car_id','client_id','rent_id','isCompleted'];
  protected $guarded = ['id',"created_at",'updated_at'];
  protected $casts = [
    'isCompleted' => 'boolean',
  ];
}
