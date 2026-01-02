using App.Application.Mapping;
using FishFarmApp;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);   //create the builder to build the application


// Add services to the container.

builder.Services.AddControllers();  //find all with name Controller and register them
builder.Services.AddAutoMapper(cfg => { }, typeof(FarmMappingProfle)); //automapper configuration


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer();    //meta data of endpoints , make easy to document and recognize endpoint

builder.Services.AddControllers().AddJsonOptions(o =>  //enum as string in json responses
{
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});


builder.Services.AddSwaggerGen(swagger =>   //sets up and configure swagger ui
{
    // This is to generate the Default UI of Swagger Documentation
    swagger.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "ASP.NET 8 Web API",
        Description = "Authentication with JWT"
    });

    // To Enable authorization using Swagger (JWT)
    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement // enable authorization to each api 
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



builder.Services.AddAppDI(builder.Configuration);    //main dependendies injected

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});


var app = builder.Build();  //build

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       //middlewares
    app.UseSwaggerUI();
}

//middlewares

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();  //automtically redirect http to https

app.UseAuthentication();  //check authentication -- typically infrastructure layer

app.UseAuthorization();   //check authorization rules and policies -- typically application layer

app.MapControllers();   //routing requests to corresponding controllers

app.Run();
