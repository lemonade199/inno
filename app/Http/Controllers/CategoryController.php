<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories with product counts.
     */
    public function index()
    {
        // If categories table is empty, auto-seed default categories
        if (Category::count() === 0) {
            $defaultCategories = [
                ['name' => 'Pakan Ayam & Unggas', 'description' => 'Pakan berkualitas untuk ayam petelur, pedaging, dan unggas ternak.', 'icon' => 'Egg', 'status' => 'Aktif'],
                ['name' => 'Pakan Ikan', 'description' => 'Pelet dan pakan apung/tenggelam untuk ikan lele, nila, mas, dan gurame.', 'icon' => 'Fish', 'status' => 'Aktif'],
                ['name' => 'Pakan Burung & Hewan', 'description' => 'Pakan voer, biji-bijian, dan nutrisi lengkap burung berkicau & peliharaan.', 'icon' => 'Feather', 'status' => 'Aktif'],
                ['name' => 'Umpan Pancing', 'description' => 'Umpan hidup, umpan racikan, pelet, dan lure tiruan.', 'icon' => 'Anchor', 'status' => 'Aktif'],
                ['name' => 'Essen Pancing', 'description' => 'Essen aroma amis, wangi, gurih untuk meningkatkan daya pikat ikan.', 'icon' => 'Droplets', 'status' => 'Aktif'],
                ['name' => 'Alat & Aksesoris Pancing', 'description' => 'Joran, reel, kail, pelampung, senar, tas pancing, dan perlengkapan.', 'icon' => 'Sparkles', 'status' => 'Aktif'],
            ];

            foreach ($defaultCategories as $cat) {
                Category::create([
                    'name' => $cat['name'],
                    'slug' => Str::slug($cat['name']),
                    'description' => $cat['description'],
                    'icon' => $cat['icon'],
                    'status' => $cat['status'],
                ]);
            }
        }

        $categories = Category::orderBy('name', 'asc')->get();

        // Calculate dynamic product count for each category
        $productCounts = Product::selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $categoriesWithCount = $categories->map(function ($cat) use ($productCounts) {
            $catArray = $cat->toArray();
            $catArray['count'] = $productCounts->get($cat->name, 0);
            return $catArray;
        });

        return response()->json($categoriesWithCount);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'status' => 'nullable|string|in:Aktif,Nonaktif',
        ]);

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        // Ensure unique slug
        $originalSlug = $slug;
        $count = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? '',
            'icon' => $validated['icon'] ?? 'Tag',
            'status' => $validated['status'] ?? 'Aktif',
        ]);

        $catArray = $category->toArray();
        $catArray['count'] = 0;

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'category' => $catArray,
        ], 201);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'status' => 'nullable|string|in:Aktif,Nonaktif',
        ]);

        $oldName = $category->name;
        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? $category->description,
            'icon' => $validated['icon'] ?? $category->icon,
            'status' => $validated['status'] ?? $category->status,
        ]);

        // If category name was renamed, optionally update corresponding products
        if ($oldName !== $category->name) {
            Product::where('category', $oldName)->update(['category' => $category->name]);
        }

        $catArray = $category->toArray();
        $catArray['count'] = Product::where('category', $category->name)->count();

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'category' => $catArray,
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $name = $category->name;
        $category->delete();

        return response()->json([
            'message' => "Kategori \"{$name}\" berhasil dihapus",
        ]);
    }
}
