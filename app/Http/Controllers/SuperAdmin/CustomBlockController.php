<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CustomBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomBlockController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255|unique:custom_blocks,type',
            'description' => 'nullable|string|max:1000',
            'fields' => 'required|array',
            'template_html' => 'required|string',
        ]);

        if (empty($validated['type'])) {
            $validated['type'] = 'custom_' . Str::slug($validated['name'], '_');
        } else {
            $validated['type'] = Str::slug($validated['type'], '_');
        }

        CustomBlock::create($validated);

        return redirect()->back()->with('status', 'Custom block created successfully.');
    }

    public function update(Request $request, CustomBlock $custom_block)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255|unique:custom_blocks,type,' . $custom_block->id,
            'description' => 'nullable|string|max:1000',
            'fields' => 'required|array',
            'template_html' => 'required|string',
        ]);

        $validated['type'] = Str::slug($validated['type'], '_');

        $custom_block->update($validated);

        return redirect()->back()->with('status', 'Custom block updated successfully.');
    }

    public function destroy(CustomBlock $custom_block)
    {
        $custom_block->delete();

        return redirect()->back()->with('status', 'Custom block deleted successfully.');
    }
}
