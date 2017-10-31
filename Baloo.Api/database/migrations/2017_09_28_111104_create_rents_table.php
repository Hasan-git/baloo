<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rents', function (Blueprint $table) {
            $table->increments('id');

            $table->dateTime('dateOut')->nullable();
            $table->dateTime('dateIn')->nullable();
            $table->integer('days')->nullable();
            $table->integer('costPerDay')->nullable();
            $table->integer('total')->nullable();
            $table->integer('cash')->nullable();
            $table->integer('dueAmount')->nullable();
            $table->integer('deposit')->nullable();
            $table->text('notes')->nullable();
            $table->string('kmOut')->nullable();
            $table->string('kmIn')->nullable();
            $table->string('kmTotal')->nullable();
            $table->string('employee')->nullable();
            $table->enum('status', ['reserved', 'out','in'])->nullable();

            $table->string('secondDriverName')->nullable();
            $table->string('secondDriverLicenseId')->nullable();

            $table->integer('car_id')->unsigned();
            $table->foreign('car_id')->references('id')->on('cars');

            $table->integer('client_id')->nullable()->unsigned();
            $table->foreign('client_id')->references('id')->on('clients');

            $table->integer('secondary_client_id')->nullable()->unsigned();
            $table->foreign('secondary_client_id')->references('id')->on('clients');

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
        Schema::dropIfExists('rents');
    }
}
