<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlertsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
          Schema::create('alerts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->integer('car_id')->nullable();
            $table->integer('client_id')->nullable();
            $table->integer('rent_id')->nullable();
            $table->boolean('isCompleted')->default(0)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('alerts');
    }
}
