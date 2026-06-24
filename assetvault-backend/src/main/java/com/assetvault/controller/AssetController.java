package com.assetvault.controller;

import com.assetvault.entity.Asset;
import com.assetvault.repository.AssetRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/assets")
@CrossOrigin(
    origins = "http://localhost:5173",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.DELETE
    }
)
public class AssetController {

    private final AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    // Get all assets
    @GetMapping
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    // Add asset
    @PostMapping
    public Asset addAsset(@RequestBody Asset asset) {
        return assetRepository.save(asset);
    }

    // Delete asset
    @DeleteMapping("/{id}")
    public String deleteAsset(@PathVariable Long id) {

        if (assetRepository.existsById(id)) {
            assetRepository.deleteById(id);
            return "Asset deleted successfully";
        }

        return "Asset not found";
    }
}