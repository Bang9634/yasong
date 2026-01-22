package com.bang9634.yasongmuseum.common.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Web configuration for handling static resources and SPA routing.
 * This configuration serves static files from the /static/ directory
 * and falls back to index.html for non-API routes to support single-page applications.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from file system
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");

        // Serve static resources for SPA
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
            @Override
            protected Resource getResource(String resourcePath, Resource location) throws IOException {
                Resource requestedResource = location.createRelative(resourcePath);

                // Exclude paths that start with "api/" or "uploads/"
                if (resourcePath.startsWith("api/") || resourcePath.startsWith("uploads/")) {
                    return null;
                }

                // Return the resource if it exists and is readable
                if (requestedResource.exists() && requestedResource.isReadable()) {
                    return requestedResource;
                }

                // Fallback to index.html for SPA routes
                return new ClassPathResource("/static/index.html");
            }
        });
    }

    /**
     * Configure CORS settings to allow requests from frontend development servers.
     * 
     * @apiNote This is typically used during development to enable communication
     *          between the frontend (e.g., Vite, React) and backend servers.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000") // frontend dev server (vite, react)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
