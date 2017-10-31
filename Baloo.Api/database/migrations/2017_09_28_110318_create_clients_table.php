<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',100)->nullable();
            $table->string('father',30)->nullable();
            $table->string('mother',30)->nullable();
            $table->string('birthPlace')->nullable();
            $table->date('dob')->nullable();
            $table->string('sejel')->nullable();
            $table->string('licenseId')->nullable();
            $table->string('address')->nullable();
            $table->string('contactNumber')->nullable();
            $table->string('emergencyContact')->nullable();

            $table->string('nationality')->nullable();
            $table->date('licenseIssueDate')->nullable();
            $table->date('licenseExpiryDate')->nullable();
            $table->enum('licenseType', ['public', 'private','international'])->nullable();

            $table->string('licenseImage',380)->nullable();
            $table->string('identityImage',380)->nullable();
            $table->string('image',380)->nullable();

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
        Schema::dropIfExists('clients');
    }
}
