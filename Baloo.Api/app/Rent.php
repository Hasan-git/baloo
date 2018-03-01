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
  public function setReceivedDateAttribute($value)
  {
    if($value)
        $this->attributes['receivedDate'] =  Carbon::parse($value);
    else
      $this->attributes['receivedDate'] = null;
  }

  public function setStatusAttribute_($out,$in)
  {
      if( Carbon::parse($in)->lte( Carbon::now() ) ) {
        $this->attributes['status'] = 'in';
        return  'in';

      }else if(Carbon::parse($out)->lt( Carbon::tomorrow() ) ) {
        $this->attributes['status'] = 'out';
        return  'out';
      }else if ( Carbon::parse($out)->gt( Carbon::today() ) ) {
        $this->attributes['status'] = 'reserved';
        return  'reserved';
      }
  }

   //getter
  public function getDateInAttribute($value)
  {
    return $this->attributes['dateIn'] =  Carbon::parse($value)->tz('Asia/Beirut');
  }
  public function getDateOutAttribute($value)
  {
    return $this->attributes['dateOut'] =  Carbon::parse($value)->tz('Asia/Beirut');
  }
  // public function getReceivedDateAttribute($value)
  // {
  //   return $this->attributes['receivedDate'] =  Carbon::parse($value)->tz('Asia/Beirut');
  // }


  // Scopes
  public function scopeActive($query)
  {
      return $query->where('status','!=','in')->orWhere('dueAmount','!=',0);
  }

  protected $fillable = ['dateOut','dateIn','days','costPerDay','total','cash','dueAmount','deposit','notes','kmOut','kmIn','kmTotal','employee','status','car_id','client_id','secondDriverName','secondDriverLicenseId','receivedDate'];
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
