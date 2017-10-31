<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Car extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('name_id')->unsigned();
            $table->foreign('name_id')->references('id')->on('cars_names');
            $table->enum('type', ['sport', 'commerce','wedding','range'])->nullable();
            $table->string('plateNumber')->nullable();
            $table->string('model')->nullable();
            $table->string('color')->nullable();
            $table->string('chassisNumber')->nullable();
            $table->date('officialMechanic')->nullable();
            $table->text('notes')->nullable();
            $table->string('image',380)->nullable();
            $table->enum('status', ['available', 'notavailable','reserved','rented','repair'])->nullable();

            $table->integer('km')->nullable();
            $table->date('purchasingDate')->nullable();
            $table->integer('purchasingPrice')->nullable();
            $table->date('sellingDate')->nullable();
            $table->integer('sellingPrice')->nullable();
            $table->boolean('isSold')->nullable()->default(false);

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
         Schema::drop('cars');
        //
    }
}
