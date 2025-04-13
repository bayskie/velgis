<?php

namespace App\Http\Controllers;

use App\Models\Shape;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;


class MapController extends Controller
{
    public function index()
    {
        $shapes = DB::table('shapes')
            ->select(
                'id',
                'name',
                'description',
                DB::raw("ST_AsGeoJSON(geometry) as geometry")
            )
            ->get();

        $geoJSON = [];

        foreach ($shapes as $shape) {
            $geoJSON[] = [
                'type' => 'Feature',
                'geometry' => json_decode($shape->geometry),
                'properties' => [
                    'id' => $shape->id,
                    'name' => $shape->name,
                    'description' => $shape->description,
                ],
            ];
        }

        return Inertia::render('map', ['shapes' => $geoJSON]);
    }

    public function bulkUpsert(Request $request)
    {
        $features = $request->input('shapes');

        foreach ($features as $feature) {
            $id = $feature['properties']['id'] ?? Str::uuid();
            $geometry = $feature['geometry'];

            DB::table('shapes')->updateOrInsert(
                ['id' => $id],
                [
                    'geometry' => DB::raw("ST_GeomFromGeoJSON('" . json_encode($geometry) . "')"),
                ]
            );
        }

        return back();
    }
}
