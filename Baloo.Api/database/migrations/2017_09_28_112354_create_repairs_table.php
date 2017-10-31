<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRepairsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('repairs', function (Blueprint $table) {
            $table->increments('id');
            $table->date('date')->nullable();
            $table->date('completionDate')->nullable();
            $table->text('problem')->nullable();
            $table->string('garage')->nullable();
            $table->integer('cost')->nullable();
            $table->integer('clientTotalCost')->nullable();
            $table->integer('clientPayment')->nullable();
            $table->integer('clientDueAmount')->nullable();
            $table->boolean('isFinished')->nullable()->default(false);
            $table->string('company',100)->nullable();
            $table->string('image',380)->nullable();

            $table->integer('client_id')->nullable()->unsigned();
            $table->foreign('client_id')->references('id')->on('clients');

            $table->integer('car_id')->unsigned();
            $table->foreign('car_id')->references('id')->on('cars');


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
        Schema::dropIfExists('repairs');
    }
}
