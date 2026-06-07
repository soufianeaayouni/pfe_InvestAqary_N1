<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('professional_profiles', function (Blueprint $table) {
            $table->unsignedInteger('profile_views')->default(0)->after('is_verified');
        });

        Schema::create('profile_view_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pro_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('viewed_at');
            $table->index(['pro_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_view_logs');

        Schema::table('professional_profiles', function (Blueprint $table) {
            $table->dropColumn('profile_views');
        });
    }
};
