<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\CarsNames;
use App\Repair;
use App\Rent;
use Carbon;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
  use SoftDeletes;

  public function name()
  {
    return $this->hasOne(CarsNames::class,'id','name_id');
  }

  public function repairs()
  {
    return $this->hasMany(Repair::class);
  }

  public function activeRepairs()
  {
    return $this->hasMany(Repair::class)->active();
  }

  public function rents()
  {
    return $this->hasMany(Rent::class);
  }

  public function inActiveRents()
  {
    return $this->hasMany(Rent::class)->where('status','in');
  }

  public function setStatusAttribute()
  {
    $repairs = $this->repairs()->where('isFinished',0)->count();
    $rents = $this->CurrentRent;
    $reserved = $this->Reservations;


    if($repairs){
      return $this->attributes['status'] = 'repair';

    }else if($rents){
      return $this->attributes['status'] = 'rented';

     }else if(!$reserved->isEmpty()){
      return $this->attributes['status'] = 'reserved';

     }else{
     return $this->attributes['status'] = 'available';
     }
  }

  // Getter
  public function getClosestReserveAttribute()
  {
    return $this->rents()->where('dateOut', '>', Carbon::now())->orderBy('dateOut', 'asc')->first();
  }

  public function getReservationsAttribute()
  {
    return $this->rents()->where('dateOut', '>', Carbon::now())->orderBy('dateOut', 'asc')->get();
  }

  public function getCurrentRentAttribute()
  {
    return $this->rents()->where([ ['status', 'out'], ['dateIn', '>=', Carbon::now() ] , ['dateOut', '<=', Carbon::now() ]])->first() ;
  }

  //Setters
  public function setPurchasingDateAttribute($value)
  {
      $this->attributes['purchasingDate'] =  Carbon::parse($value);
  }

  public function setOfficialMechanicAttribute($value)
  {
      $this->attributes['officialMechanic'] =  Carbon::parse($value);
  }

    public function setSellingDateAttribute($value)
  {
      $this->attributes['sellingDate'] =  Carbon::parse($value);
  }


  protected $fillable = ['name_id','type','plateNumber','model','color','chassisNumber','notes','status','officialMechanic','km','purchasingDate','purchasingPrice'];
  protected $guarded = ['id',"created_at",'updated_at','deleted_at'];

  protected $dates = ['deleted_at'];

  protected $casts = [
        'purchasingPrice' => 'integer',
    ];

}
