<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCarsNamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('cars_names', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->enum('brand', [
                                    'mercedes',
                                    'audi',
                                    // 'volkswagen',
                                    'bmw',
                                    'opel',
                                    // 'porsche',
                                    // 'fiat',
                                    // 'alfa romeo',
                                    // 'maserati',
                                    // 'citroen',
                                    'renault',
                                    'peugeot',
                                    // 'land rover',
                                    'jeep',
                                    'chevrolet',
                                    'gmc',
                                    'ford',
                                    'honda',
                                    'toyota',
                                    'suzuki',
                                    'infiniti',
                                    'mazda',
                                    'nissan',
                                    'hyundai',
                                    'kia',
                                    'geely',
                                    'saipa',
                                    'chery'
                                ])->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cars_names');
    }
}
