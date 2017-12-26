<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Repair;
use App\Rent;
use Carbon;

class Client extends Model
{
  use SoftDeletes;

  public function rents()
  {
    return $this->hasMany(Rent::class);
  }

  public function repairs()
  {
    return $this->hasMany(Repair::class);
  }

  // Test This Later should act as Getter method
  // public function getDates()
  // {
  //     $dates = $this->dates()->getQuery()->orderBy('created_at', 'asc')->get();
  //     return $dates;
  // }

  // Setters
  public function setDobAttribute($value)
  {
      $this->attributes['dob'] =  Carbon::parse($value)->format('Y-m-d');
  }
  public function setLicenseExpiryDateAttribute($value)
  {
      $this->attributes['licenseExpiryDate'] =  Carbon::parse($value)->format('Y-m-d');
  }
  public function setLicenseIssueDateAttribute($value)
  {
      $this->attributes['licenseIssueDate'] =  Carbon::parse($value)->format('Y-m-d');
  }

  //getter
  public function getTotalDueAmountAttribute()
  {
      return (int) $this->rents()->sum("dueAmount"); // Calculate client all due amounts on rents
  }

  public function getTotalRepairsDueAmountAttribute()
  {
      return (int) $this->repairs()->sum("clientDueAmount"); // Calculate client all due amounts on repairs
  }

  protected $fillable = ['name','father','mother','birthPlace','dob','sejel','licenseId','address','contactNumber','emergencyContact','nationality','licenseIssueDate','licenseExpiryDate','licenseType'];
  protected $guarded = ['id',"created_at",'updated_at','deleted_at'];

  protected $dates = ['deleted_at'];
}
