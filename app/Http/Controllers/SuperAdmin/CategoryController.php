<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
        ]);

        $name = trim($validated['name']);
        $slug = !empty($validated['slug']) 
            ? Str::slug($validated['slug'], '_') 
            : Str::slug($name, '_');

        if (empty($slug)) {
            $slug = 'cat_' . time();
        }

        $category = Category::firstOrCreate(
            ['slug' => $slug],
            ['name' => $name]
        );

        if ($request->wantsJson() || $request->ajax() || $request->isJson()) {
            return response()->json([
                'success' => true,
                'category' => $category,
                'message' => 'Category added successfully.',
            ]);
        }

        return redirect()->back()->with('status', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $category->id,
        ]);

        $validated['slug'] = Str::slug($validated['slug']);

        $category->update($validated);

        return redirect()->back()->with('status', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->back()->with('status', 'Category deleted successfully.');
    }
}
