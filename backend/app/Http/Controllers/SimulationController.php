<?php

namespace App\Http\Controllers;

use App\Models\Simulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SimulationController extends Controller
{
    public function index(Request $request)
    {
        $simulations = Simulation::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'simulations' => $simulations,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_type' => 'required|string|max:255',
            'area' => 'required|numeric|min:1',
            'budget_min' => 'required|numeric|min:0',
            'budget_max' => 'required|numeric|min:0|gte:budget_min',
            'raw_data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        $simulation = Simulation::create([
            'user_id' => $user?->id,
            'project_type' => $request->project_type,
            'area' => $request->area,
            'budget_min' => $request->budget_min,
            'budget_max' => $request->budget_max,
            'raw_data' => $request->raw_data,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Simulation saved successfully.',
            'simulation' => $simulation,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $simulation = Simulation::findOrFail($id);

        if ($simulation->user_id !== null
            && (!$request->user() || $request->user()->id != $simulation->user_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this simulation.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'simulation' => $simulation,
        ]);
    }

    public function update(Request $request, $id)
    {
        $simulation = Simulation::findOrFail($id);

        if (!$request->user() || $request->user()->id != $simulation->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this simulation.',
            ], 403);
        }

        $payload = array_merge(
            $simulation->only(['project_type', 'area', 'budget_min', 'budget_max', 'raw_data']),
            $request->all()
        );

        $validator = Validator::make($payload, [
            'project_type' => 'required|string|max:255',
            'area' => 'required|numeric|min:1',
            'budget_min' => 'required|numeric|min:0',
            'budget_max' => 'required|numeric|min:0|gte:budget_min',
            'raw_data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $simulation->update($request->only([
            'project_type',
            'area',
            'budget_min',
            'budget_max',
            'raw_data',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Simulation updated successfully.',
            'simulation' => $simulation->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $simulation = Simulation::findOrFail($id);

        if (!$request->user() || $request->user()->id != $simulation->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this simulation.',
            ], 403);
        }

        $simulation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Simulation deleted successfully.',
        ]);
    }
}
