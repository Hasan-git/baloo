<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Client;
use Carbon;
use App\Car;


class Rent extends Model
{

  use SoftDeletes;

  public function car()
  {
    return $this->belongsTo(Car::class);
  }

  public function client()
  {
    return $this->belongsTo(Client::class);
  }


  // Setters
  public function setDateInAttribute($value)
  {
      $this->attributes['dateIn'] =  Carbon::parse($value);
  }
  public function setDateOutAttribute($value)
  {
      $this->attributes['dateOut'] =  Carbon::parse($value);
  }

  public function setStatusAttribute()
  {
      if( Carbon::parse($this->attributes['dateIn'])->lte( Carbon::today() ) ) {
        $this->attributes['status'] = 'in';
      }else if(Carbon::parse($this->attributes['dateOut'])->lt( Carbon::tomorrow() ) ) {
        $this->attributes['status'] = 'out';
      }else if ( Carbon::parse($this->attributes['dateOut'])->gt( Carbon::today() ) ) {
        $this->attributes['status'] = 'reserved';
      }
  }

  // Scopes
  public function scopeActive($query)
  {
      return $query->where('status','!=','in')->orWhere('dueAmount','!=',0);
  }

  protected $fillable = ['dateOut','dateIn','days','costPerDay','total','cash','dueAmount','deposit','notes','kmOut','kmIn','kmTotal','employee','status','car_id','client_id','secondDriverName','secondDriverLicenseId'];
  protected $guarded = ['id','created_at','updated_at','deleted_at'];

  protected $dates = ['deleted_at'];

  protected $casts = [
        'kmOut' => 'integer',
        'kmIn' => 'integer',
        'kmTotal' => 'integer',
        'total' => 'integer',
        'cash' => 'integer',
        'dueAmount' => 'integer',
        'deposit' => 'integer'
    ];
}
