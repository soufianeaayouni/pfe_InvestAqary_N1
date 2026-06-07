<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('professional_profiles', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->string('experience')->nullable();
            $table->string('ice')->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('banner_photo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('professional_profiles', function (Blueprint $table) {
            $table->dropColumn(['description', 'experience', 'ice', 'profile_photo', 'banner_photo']);
        });
    }
};
