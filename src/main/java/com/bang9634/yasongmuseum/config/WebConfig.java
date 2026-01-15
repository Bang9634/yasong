package com.bang9634.yasongmuseum.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
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
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
            @Override
            protected Resource getResource(String resourcePath, Resource location) throws IOException {
                Resource requestedResource = location.createRelative(resourcePath);

                // Exclude paths that start with "api/"
                if (resourcePath.startsWith("api/")) {
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
}
