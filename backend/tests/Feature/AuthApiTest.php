<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_register_and_login(): void
    {
        $register = $this->postJson('/api/register/client', [
            'first_name' => 'Karim',
            'last_name' => 'Benali',
            'email' => 'karim@example.com',
            'phone' => '0612345678',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $register->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['access_token', 'user']);

        $login = $this->postJson('/api/login', [
            'email' => 'karim@example.com',
            'password' => 'password123',
        ]);

        $login->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['access_token']);
    }

    public function test_pro_can_register_with_company(): void
    {
        $response = $this->postJson('/api/register/pro', [
            'email' => 'pro@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'company_name' => 'BTP Atlas',
            'category' => 'materials',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.role', 'pro')
            ->assertJsonPath('user.professional_profile.company_name', 'BTP Atlas');
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => 'password123',
            'role' => 'client',
        ]);

        $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'wrong-password',
        ])->assertUnauthorized()
            ->assertJsonPath('success', false);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('success', true);
    }
}
