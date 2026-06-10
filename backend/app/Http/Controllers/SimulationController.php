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

        return view('dashboard.client-simulations', compact('simulations'));
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
            return back()->withErrors($validator)->withInput();
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

        return redirect('/mes-simulations')->with('success', 'Simulation enregistrée.');
    }

    public function show(Request $request, $id)
    {
        $simulation = Simulation::findOrFail($id);

        if ($simulation->user_id !== null
            && (!$request->user() || $request->user()->id != $simulation->user_id)) {
            abort(403, 'Unauthorized access to this simulation.');
        }

        return view('dashboard.client-simulation-detail', compact('simulation'));
    }

    public function update(Request $request, $id)
    {
        $simulation = Simulation::findOrFail($id);

        if (!$request->user() || $request->user()->id != $simulation->user_id) {
            return back()->with('error', 'Unauthorized to update this simulation.');
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
            return back()->withErrors($validator)->withInput();
        }

        $simulation->update($request->only([
            'project_type',
            'area',
            'budget_min',
            'budget_max',
            'raw_data',
        ]));

        return back()->with('success', 'Simulation mise à jour.');
    }

    public function destroy(Request $request, $id)
    {
        $simulation = Simulation::findOrFail($id);

        if (!$request->user() || $request->user()->id != $simulation->user_id) {
            return back()->with('error', 'Unauthorized to delete this simulation.');
        }

        $simulation->delete();

        return back()->with('success', 'Simulation supprimée.');
    }
}
