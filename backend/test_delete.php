<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('role', 'pro')->first();
auth()->login($user);

$project = App\Models\Project::where('user_id', $user->id)->first();
if (!$project) {
    echo "No project found.\n";
    exit;
}

echo "Deleting project {$project->id} for user {$user->id}...\n";

$request = Illuminate\Http\Request::create("/dashboard/pro/projects/{$project->id}", 'POST', [
    '_method' => 'DELETE',
    '_token' => csrf_token()
]);
$request->setUserResolver(function() use ($user) { return $user; });

$response = app()->handle($request);
echo "Status: " . $response->status() . "\n";
if ($response->isRedirect()) {
    echo "Redirect: " . $response->headers->get('Location') . "\n";
}
