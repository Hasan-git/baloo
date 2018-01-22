<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Client;

class Clients_images extends Model
{
  public function client()
  {
    return $this->belongsTo(Client::class);
  }

     protected $fillable = ['name','client_id'];
     protected $guarded = ['id',"created_at",'updated_at'];
}
