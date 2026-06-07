<?php

namespace Tests\Feature;

use App\Models\Simulation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SimulationApiTest extends TestCase
{
    use RefreshDatabase;

    private function simulationPayload(): array
    {
        return [
            'project_type' => 'immeuble',
            'area' => 1200,
            'budget_min' => 1000000,
            'budget_max' => 2000000,
            'raw_data' => ['step' => 1, 'standing' => 'haut'],
        ];
    }

    public function test_guest_can_create_and_view_public_simulation(): void
    {
        $create = $this->postJson('/api/simulations', $this->simulationPayload());

        $create->assertCreated()
            ->assertJsonPath('success', true);

        $id = $create->json('simulation.id');

        $this->getJson("/api/simulations/{$id}")
            ->assertOk()
            ->assertJsonPath('simulation.user_id', null);
    }

    public function test_authenticated_user_simulation_is_private(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $other = User::factory()->create(['role' => 'client']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $create = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/simulations', $this->simulationPayload());

        $id = $create->json('simulation.id');

        $this->getJson("/api/simulations/{$id}")
            ->assertForbidden();

        $otherToken = $other->createToken('auth_token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer '.$otherToken)
            ->getJson("/api/simulations/{$id}")
            ->assertForbidden();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/simulations/{$id}")
            ->assertOk();
    }

    public function test_user_can_list_update_and_delete_own_simulations(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $token = $user->createToken('auth_token')->plainTextToken;
        $headers = ['Authorization' => 'Bearer '.$token];

        $simulation = Simulation::create([
            'user_id' => $user->id,
            ...$this->simulationPayload(),
        ]);

        $this->withHeaders($headers)
            ->getJson('/api/simulations')
            ->assertOk()
            ->assertJsonCount(1, 'simulations');

        $this->withHeaders($headers)
            ->putJson("/api/simulations/{$simulation->id}", [
                'project_type' => 'villa',
                'area' => 500,
                'budget_min' => 500000,
                'budget_max' => 800000,
                'raw_data' => ['updated' => true],
            ])
            ->assertOk()
            ->assertJsonPath('simulation.project_type', 'villa');

        $this->withHeaders($headers)
            ->deleteJson("/api/simulations/{$simulation->id}")
            ->assertOk();

        $this->assertDatabaseMissing('simulations', ['id' => $simulation->id]);
    }

    public function test_store_rejects_invalid_budget_range(): void
    {
        $payload = $this->simulationPayload();
        $payload['budget_max'] = 100;
        $payload['budget_min'] = 500000;

        $this->postJson('/api/simulations', $payload)
            ->assertUnprocessable()
            ->assertJsonPath('success', false);
    }
}
